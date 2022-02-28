import { clickOutSideDirective } from "@mr-hope/vuepress-shared/lib/client";
import { Content } from "@vuepress/client";
import { defineComponent, h, ref, withDirectives } from "vue";
import { useRouter } from "vue-router";
import { BackIcon, HomeIcon } from "./components/icons";

import type { VNode } from "vue";

import "./styles/layout.scss";

export default defineComponent({
  name: "SlidePage",

  setup() {
    const router = useRouter();
    const showMenu = ref(false);

    const toggle = (): void => {
      showMenu.value = !showMenu.value;
    };

    const closeMenu = (): void => {
      showMenu.value = false;
    };

    const back = (): void => {
      closeMenu();
      window.history.go(-1);
    };

    const home = (): void => {
      closeMenu();
      void router.push("/");
    };

    return (): VNode =>
      h("div", { class: "presentation" }, [
        h(Content),
        withDirectives(
          h("div", { class: ["menu", { active: showMenu.value }] }, [
            h(
              "button",
              { class: "menu-button", onClick: () => toggle() },
              h("span", { class: "icon" })
            ),
            h(
              "button",
              { class: "back-button", onClick: () => back() },
              h(BackIcon)
            ),
            h(
              "button",
              { class: "home-button", onClick: () => home() },
              h(HomeIcon)
            ),
          ]),
          [[clickOutSideDirective, closeMenu]]
        ),
      ]);
  },
});
