// webrtc.js
// Tomohiro Iwasa, Avaya Japan, 2017-2022
// Updated: 20220808

((window) => {
	'use strict';

	function WebRTC() {
		this.socket_emit = null;
		this.videoSources = [];
		this.videoSourceId = 0;
		this.local = null;
		this.remote = null;
		this.peerConnection = null;
		this.isOffer = false;
	}

	WebRTC.prototype = {
		init: function(socket_emit, localMediaId, remoteMediaId) {
			this.socket_emit = socket_emit;
			this.local = { media: document.querySelector(localMediaId), channel: null };
			this.remote = { media: document.querySelector(remoteMediaId), channel: null };
			this.peerConnection = null;
		},

		getPeerConnection: function() {
			return this.peerConnection;
		},

		cleanUpMedia: async function(client) {
			if (client.media) {
				client.media.pause();
				client.media.srcObject = null;
			}
		},

		playVideo: async function(client, stream) {
			try {
				client.channel = stream;
				client.media.srcObject = stream;
				await client.media.play();
				console.log(`[playVideo] started ${client.media}`);
			}
			catch (error) {
				console.log(`[playVideo] ${error}`);
			}
		},

		stopVideoTracks: async function(client) {
			try {
				await client.channel.getTracks().forEach((track) => {
					console.log(track);
					track.stop();
					client.channel = null;
				});
			}
			catch (error) {
				console.log(`[stopVideoTracks] ${error}`);
			}
		},

		getLocalStream: async function() {
			const constraints = {
				//video : {deviceId:(this.videoSources ? {exact:this.videoSources[this.videoSourceId]} : undefined)},
				video: { width: { min: 640, ideal: 1280 }, height: { min: 480, ideal: 720 } },
				audio: false,
			};
			console.log(`[getLocalStream] ${JSON.stringify(constraints)}`);
			return navigator.mediaDevices.getUserMedia(constraints).then(async (stream) => {
				await this.playVideo(this.local, stream);
			});
		},

		startVideo: async function(isOffer) {
			this.isOffer = isOffer;
			console.log(`[startVideo] ${isOffer}`);
			try {
				await this.getLocalStream().then(() => {
					return navigator.mediaDevices.enumerateDevices();
				}).then((devices) => {
					devices.forEach((device) => {
						console.log(`[getDeviceInfo] device.kind:${device.kind} device.label:${device.label} device.deviceId:${device.deviceId}`);
						if (device.kind === "videoinput") {
							this.videoSources.push(device);
						}
					});
					console.log(`[getDeviceInfo] videoSources:${JSON.stringify(this.videoSources)}`);
				}).then(() => {
					this.peerConnection = new RTCPeerConnection({ "iceServers": [{ urls: "stun:stun.l.google.com:19302?transport=udp" }] });
					this.peerConnection.ontrack = async (event) => {
						console.log(`-- peer.ontrack`);
						await this.playVideo(this.remote, event.streams[0]);
					};
					this.peerConnection.onicecandidate = event => {
						if (event.candidate) {
							console.log(`-- peer.onicecandidate event.candidate ${JSON.stringify(event.candidate)}`);
							this.socket_emit({ sdp: { type: 'candidate', ice: event.candidate } });
						}
						else {
							console.log(`-- peer.onicecandidate empty ice event`);
							this.socket_emit({ sdp: this.peerConnection.localDescription });
						}
					};
					this.peerConnection.onnegotiationneeded = async () => {
						try {
							if (this.isOffer) {
								this.peerConnection.createOffer().then(async (offer) => {
									console.log(`-- peer.onnegotiationneeded createOffer() succsess in promise`);
									this.peerConnection.setLocalDescription(offer);
								}).then(() => {
									console.log(`-- peer.onnegotiationneeded setLocalDescription() succsess in promise : ${this.peerConnection.localDescription}`);
									this.socket_emit({ sdp: this.peerConnection.localDescription });
								});
							}
						}
						catch (error) {
							console.log(`[prepareConnection] peer.onnegotiationneeded ${error}`);
						}
					};
					this.peerConnection.oniceconnectionstatechange = async () => {
						console.log(`-- peer.oniceconnectionstatechange ICE connection Status has changed to ${this.peerConnection.iceConnectionState}`);
						switch (this.peerConnection.iceConnectionState) {
							case 'closed':
							case 'failed':
							case 'disconnected':
								this.hangUp();
								break;
						}
					};
					if (!this.local.channel) {
						console.log(`[prepareConnection] no local stream, but continue`);
						return null;
					}
					else {
						console.log(`[prepareConnection] Adding local stream...`);
						this.local.channel.getTracks().forEach((track) => this.peerConnection.addTrack(track, this.local.channel));
					}
				});
			}
			catch (error) {
				console.log(`[startVideo] ${error}`);
			}
		},

		on: function(message) {
			if (!message.body.sdp) return;
			console.log(`[webrtc on] message.body.sdp.type ${message.body.sdp.type}`);
			switch (message.body.sdp.type) {
				case "offer": {
					this.setOffer(message.body.sdp);
					break;
				}
				case "answer": {
					this.setAnswer(message.body.sdp);
					break;
				}
				case "candidate": {
					this.addIceCandidate(new RTCIceCandidate(message.body.sdp.ice));
					break;
				}
				case "close": {
					this.hangUp();
					break;
				}
				default: {
					break;
				}
			}
		},

		addIceCandidate: function(candidate) {
			if (this.peerConnection && this.peerConnection.remoteDescription) {
				console.log(`[addIceCandidate] this.peerConnection ${JSON.stringify(candidate)}`);
				this.peerConnection.addIceCandidate(candidate);
			}
		},

		makeAnswer: async function() {
			try {
				await this.peerConnection.createAnswer().then(async (answer) => {
					console.log(`[makeAnswer] createAnswer() success in promis`);
					await this.peerConnection.setLocalDescription(answer);
				}).then(() => {
					console.log(`[makeAnswer] setLocalDescription() success in promise > send SDP`);
					this.socket_emit({ sdp: this.peerConnection.localDescription });
				});
			}
			catch (error) {
				console.log(`[makeAnswer] ${error}`);
			}
		},

		setOffer: async function(sessionDescription) {
			try {
				await this.peerConnection.setRemoteDescription(sessionDescription).then(async () => {
					console.log(`[setOffer] setRemoteDescription(answer) success in promise > makeAnswer`);
					await this.makeAnswer();
				});
			}
			catch (error) {
				console.log(`[setOffer] ${error}`);
			}
		},

		setAnswer: async function(sessionDescription) {
			try {
				await this.peerConnection.setRemoteDescription(sessionDescription);
				console.log(`[setAnswer] setRemoteDescription(answer) succsess in promise`);
			}
			catch (error) {
				console.log(`[setAnswer] ${error}`);
			}
		},

		hangUp: async function() {
			if (this.peerConnection) {
				this.peerConnection = null;
				await this.stopVideoTracks(this.remote).then(this.cleanUpMedia(this.remote));
				await this.stopVideoTracks(this.local).then(this.cleanUpMedia(this.local));
				console.log(`[hangUp] this.peerConnection is closed`);
			}
			else {
				console.log(`[hangUp] this.peerConnection is already closed`);
			}
		},
	}

	window.WebRTC = WebRTC;

})(window);

