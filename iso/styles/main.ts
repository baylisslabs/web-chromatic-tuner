
class Main {
 "@global" = {
    html: {
      boxSizing: "border-box",
      fontSize: "100%"
    },
    "*, *:before, *:after": {
        boxSizing: "inherit"
    }
  }

  grid = {
    maxWidth: "960px",
    margin: "0 auto"
  }
}

export const main = new Main();
