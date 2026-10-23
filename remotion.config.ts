import {Config} from "@remotion/cli/config";

// Export defaults: H.264 MP4, high quality, widely compatible pixel format.
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
