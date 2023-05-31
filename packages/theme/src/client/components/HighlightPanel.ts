import { withBase } from "@vuepress/client";
import {
  type PropType,
  type SlotsType,
  type VNode,
  defineComponent,
  h,
} from "vue";
import { RouterLink } from "vue-router";
import { isLinkExternal } from "vuepress-shared/client";

import HopeIcon from "@theme-hope/components/HopeIcon";

import {
  type ThemeProjectHomeHighlightOptions,
  type ThemeProjectHomeItemOption,
} from "../../shared/index.js";

import "../styles/highlight-panel.scss";

export default defineComponent({
  name: "HighlightPanel",

  props: {
    /**
     * Highlight Section title
     */
    header: { type: String, default: "" },

    /**
     * Highlight Section description
     */
    description: { type: String, default: "" },

    /**
     * Text color
     */
    color: { type: String, default: "" },

    /**
     * Highlight Section image
     */
    image: { type: String, default: "" },

    /**
     * Highlight Background image used in darkmode
     *
     * @default image
     */
    imageDark: { type: String, default: "" },

    /**
     * Highlight Background image
     */
    bgImage: { type: String, default: "" },

    /**
     * Highlight Background image used in darkmode
     *
     * @default bgImage
     */
    bgImageDark: { type: String, default: "" },

    /**
     * Highlight Background image style
     */
    bgImageStyle: { type: [String, Object], default: "" },

    /**
     * Highlight Section type
     *
     * @default un-order
     */
    type: {
      type: String as PropType<"order" | "un-order" | "no-order">,
      default: "un-order",
    },

    /**
     * Highlights
     */
    highlights: {
      type: Array as PropType<ThemeProjectHomeItemOption[]>,
      default: () => [],
    },
  },

  slots: Object as SlotsType<{
    image?: (props: ThemeProjectHomeHighlightOptions) => VNode[] | VNode | null;
    info?: (props: ThemeProjectHomeHighlightOptions) => VNode[] | VNode | null;
    highlights?: (
      props: ThemeProjectHomeItemOption[]
    ) => VNode[] | VNode | null;
  }>,

  setup(props, { slots }) {
    return (): VNode => {
      const {
        bgImage,
        bgImageDark,
        bgImageStyle,
        color,
        description,
        image,
        imageDark,
        header,
        highlights,
        type,
      } = props;

      return h(
        "div",
        {
          class: "vp-highlight-wrapper",
          style: color ? { color: color } : {},
        },
        [
          bgImage
            ? h("div", {
                class: ["vp-highlight-bg", { light: bgImageDark }],
                style: [
                  { "background-image": `url(${bgImage})` },
                  bgImageStyle,
                ],
              })
            : null,
          bgImageDark
            ? h("div", {
                class: "vp-highlight-bg dark",
                style: [
                  { "background-image": `url(${bgImageDark})` },
                  bgImageStyle,
                ],
              })
            : null,

          h("div", { class: "vp-highlight" }, [
            slots.image?.(props) || [
              image
                ? h("img", {
                    class: ["vp-highlight-image", { light: imageDark }],
                    src: withBase(image),
                    alt: header,
                  })
                : null,
              imageDark
                ? h("img", {
                    class: "vp-highlight-image dark",
                    src: withBase(imageDark),
                    alt: header,
                  })
                : null,
            ],

            slots.info?.(props) || [
              h(
                "div",
                { class: "vp-highlight-info-wrapper" },
                h("div", { class: "vp-highlight-info" }, [
                  header
                    ? h("h2", {
                        class: "vp-highlight-header",
                        innerHTML: header,
                      })
                    : null,
                  description
                    ? h("p", {
                        class: "vp-highlight-description",
                        innerHTML: description,
                      })
                    : null,
                  slots.highlights?.(highlights) ||
                    h(
                      type === "order"
                        ? "ol"
                        : type === "no-order"
                        ? "dl"
                        : "ul",
                      { class: "vp-highlights" },
                      highlights.map(({ icon, title, details, link }) => {
                        const children = [
                          h(
                            type === "no-order" ? "dt" : "h3",
                            { class: "vp-highlight-title" },
                            [
                              icon
                                ? h(HopeIcon, {
                                    class: "vp-highlight-icon",
                                    icon,
                                  })
                                : null,
                              h("span", { innerHTML: title }),
                            ]
                          ),
                          details
                            ? h(type === "no-order" ? "dd" : "p", {
                                class: "vp-highlight-details",
                                innerHTML: details,
                              })
                            : null,
                        ];

                        return h(
                          type === "no-order" ? "div" : "li",
                          {
                            class: ["vp-highlight-item-wrapper", { link }],
                          },
                          link
                            ? isLinkExternal(link)
                              ? h(
                                  "a",
                                  {
                                    class: "vp-highlight-item link",
                                    href: link,
                                    role: "navigation",
                                    "aria-label": title,
                                    target: "_blank",
                                  },
                                  children
                                )
                              : h(
                                  RouterLink,
                                  {
                                    class: "vp-highlight-item link",
                                    to: link,
                                    role: "navigation",
                                    "aria-label": title,
                                  },
                                  () => children
                                )
                            : h("div", { class: "vp-highlight-item" }, children)
                        );
                      })
                    ),
                ])
              ),
            ],
          ]),
        ]
      );
    };
  },
});