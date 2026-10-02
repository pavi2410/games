import { render } from "@solidjs/web";
import "@fontsource-variable/fredoka";
import { Router } from "./app/router";
import Shell from "./app/Shell";
import "./index.css";

render(
  () => <Router>{(props) => <Shell>{props.children}</Shell>}</Router>,
  document.getElementById("root")!,
);
