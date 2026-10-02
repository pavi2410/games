import { render } from "@solidjs/web";
import { Router } from "./app/router";
import "./index.css";

render(
  () => (
    <Router>
      {(props) => (
        <div class="mx-auto max-w-5xl p-4">
          <header class="mb-6">
            <a href="/" class="text-xl font-bold">Games</a>
          </header>
          <main>{props.children}</main>
        </div>
      )}
    </Router>
  ),
  document.getElementById("root")!,
);
