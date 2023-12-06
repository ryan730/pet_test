import { processApis } from '@tarojs/shared'
export const noPromiseApis = new Set([
    'getAccountInfoSync',
    'getEnterOptionsSync',
    'offBLEPeripheralConnectionStateChanged',
    'offBeaconServiceChange',
    'offBeaconUpdate',
    'offDeviceMotionChange',
    'offHCEMessage',
    'offKeyboardHeightChange',
    'offLocalServiceDiscoveryStop',
    'offLocalServiceFound',
    'offLocalServiceLost',
    'offLocalServiceResolveFail',
    'offLocationChange',
    'offThemeChange',
    'offVoIPChatInterrupted',
    'offVoIPChatMembersChanged',
    'offVoIPVideoMembersChanged',
    'offWifiConnected',
    'offWindowResize',
    'onBLEPeripheralConnectionStateChanged',
    'onBackgroundAudioPause',
    'onBackgroundAudioPlay',
    'onBackgroundAudioStop',
    'onBackgroundFetchData',
    'onHCEMessage',
    'onKeyboardHeightChange',
    'onLocalServiceDiscoveryStop',
    'onLocalServiceFound',
    'onLocalServiceLost',
    'onLocalServiceResolveFail',
    'onLocationChange',
    'onThemeChange',
    'onVoIPChatInterrupted',
    'onVoIPChatMembersChanged',
    'onVoIPChatSpeakersChanged',
    'onVoIPVideoMembersChanged',
    'onWifiConnected',
    'onWindowResize',
    'reportMonitor',
    'onGyroscopeChange',
    'offGyroscopeChange',
    'createAudioContext',
    'createLivePusherContext',
    'createMediaContainer',
    'createMediaRecorder',
    'createOffscreenCanvas',
    'createRewardedVideoAd',
    'createUDPSocket',
    'createVideoDecoder',
    'createWorker',
    'getLogManager',
    'getNFCAdapter',
    'getPerformance',
    'getRealtimeLogManager',
    'pauseBackgroundAudio',
    'pauseVoice',
    'reportPerformance',
    'stopBackgroundAudio',
    'stopRecord',
    'stopVoice',
    'onBluetoothDeviceFound',
    'onBluetoothAdapterStateChange',
    'offBluetoothDeviceFound',
    'offBluetoothAdapterStateChange',
    'onBLEConnectionStateChange',
    'onBLECharacteristicValueChange',
    'offBLEConnectionStateChange',
    'offBLECharacteristicValueChange',
    'onCopyUrl',
    'offCopyUrl'
])

export const needPromiseApis = new Set([
    'addCard',
    'authPrivateMessage',
    'checkIsOpenAccessibility',
    'checkIsSoterEnrolledInDevice',
    'checkIsSupportSoterAuthentication',
    'chooseInvoice',
    'chooseMedia',
    'chooseMessageFile',
    'compressVideo',
    'connectWifi',
    'createBLEPeripheralServer',
    'disableAlertBeforeUnload',
    'enableAlertBeforeUnload',
    'exitVoIPChat',
    'getBLEDeviceRSSI',
    'getBackgroundAudioPlayerState',
    'getBackgroundFetchData',
    'getBackgroundFetchToken',
    'getGroupEnterInfo',
    'getHCEState',
    'getSelectedTextRange',
    'getShareInfo',
    'getVideoInfo',
    'getWeRunData',
    'join1v1Chat',
    'joinVoIPChat',
    'makeBluetoothPair',
    'openCard',
    'openVideoEditor',
    'playBackgroundAudio',
    'playVoice',
    'previewMedia',
    'requestPayment',
    'saveFileToDisk',
    'scanItem',
    'seekBackgroundAudio',
    'sendHCEMessage',
    'setBLEMTU',
    'setBackgroundFetchToken',
    'setEnable1v1Chat',
    'setTopBarText',
    'setWifiList',
    'setWindowSize',
    'showRedPackage',
    'startGyroscope',
    'startHCE',
    'startLocalServiceDiscovery',
    'startLocationUpdate',
    'startLocationUpdateBackground',
    'startRecord',
    'startSoterAuthentication',
    'startWifi',
    'stopGyroscope',
    'stopHCE',
    'stopLocalServiceDiscovery',
    'stopLocationUpdate',
    'stopWifi',
    'subscribeVoIPVideoMembers',
    'updateShareMenu',
    'updateVoIPChatMuteConfig',
    'updateWeChatApp',
    'sendBizRedPacket',
    'getUserProfile',
    'stopBluetoothDevicesDiscovery',
    'startBluetoothDevicesDiscovery',
    'openBluetoothAdapter',
    'getConnectedBluetoothDevices',
    'getBluetoothDevices',
    'getBluetoothAdapterState',
    'closeBluetoothAdapter',
    'writeBLECharacteristicValue',
    'readBLECharacteristicValue',
    'notifyBLECharacteristicValueChange',
    'getBLEDeviceServices',
    'getBLEDeviceCharacteristics',
    'createBLEConnection',
    'closeBLEConnection',
    'startFacialRecognitionVerify'
])



declare const wx: any

export function initNativeApi(taro) {
    processApis(taro, wx, {
        noPromiseApis,
        needPromiseApis
    })
    taro.cloud = wx.cloud
}


const { CurrentReconciler } = require('@tarojs/runtime')

CurrentReconciler.initNativeApi = initNativeApi
