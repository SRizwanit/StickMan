import {Config} from '@remotion/cli/config';

Config.setEntryPoint('./index.ts');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(18);
Config.setOverwriteOutput(true);
// Google Fonts are downloaded while rendering; give slow networks more time.
Config.setDelayRenderTimeoutInMilliseconds(90000);
