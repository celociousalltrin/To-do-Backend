// const morgan = require("morgan");
// var colors = require("colors/safe");

import colors from "colors/safe";
import morgan from "morgan";

const colorizeRequest = (input: string) => {
  colors.setTheme({
    customRedierectColor: ["yellow", "bold"],
  });

  const message = input.split(" ");
  const statusCode = parseInt(message[3]);
  if (statusCode >= 200 && statusCode <= 299) {
    console.log(colors.cyan(input));
  } else if (statusCode >= 300 && statusCode <= 399) {
    statusCode === 304
      ? console.log(colors.yellow(input))
      : console.log((colors as any).customRedierectColor(input));
  } else if (statusCode >= 400 && statusCode <= 499) {
    console.log(colors.magenta(input));
  } else if (statusCode >= 500) {
    console.log(colors.bold(input));
  } else {
    console.log(input);
  }
};
const stream = {
  write: colorizeRequest,
};

const morganMiddleware = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  // You can create your custom token to show what do you want from a request.
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  // Options: in this case, I overwrote the stream and the skip logic.
  // See the methods above.
  { stream }
);

export default morganMiddleware;
