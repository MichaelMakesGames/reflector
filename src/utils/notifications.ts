import { Notyf } from "notyf";
import colors from "~colors";

const notifications = new Notyf({
  position: { x: "right", y: "bottom" },
  types: [
    { type: "error", background: colors.invalid },
    { type: "success", background: colors.secondary },
  ],
  duration: 10000,
  dismissible: true,
});

export default notifications;
