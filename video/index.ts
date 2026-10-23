// Entry point for the Remotion CLI (studio / render / still). The Next app
// never imports this — it embeds individual scenes through @remotion/player.
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
