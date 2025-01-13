// utils/mediasoupClient.ts
import * as mediasoupClient from 'mediasoup-client';

export const createDevice = async (rtpCapabilities: any) => {
    const device = new mediasoupClient.Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });
    return device;
};