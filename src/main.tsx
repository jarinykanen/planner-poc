import type { MantineColorsTuple, MantineTheme } from "@mantine/core";
import { Button, MantineProvider, SegmentedControl, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import buttonClasses from "./styles/button.module.css";
import "./styles/global.css";
import segmentedControlClasses from "./styles/segmentedControl.module.css";

const plannerPrimary: MantineColorsTuple = [
  "#fff3e3",
  "#ffe6ce",
  "#facca0",
  "#f6b06e",
  "#f29843",
  "#f18928",
  "#f08118",
  "#d66e0a",
  "#bf6103",
  "#a75200"
]

const theme = createTheme({
  primaryColor: "planner-primary",
  colors: {
    "planner-primary": plannerPrimary,
  },
  fontFamily: "Inter, sans-serif",
  headings: {
    sizes: {
      h2: {
        fontSize: "1.25rem",
      },
      h3: {
        fontSize: "1.15rem",
      },
    },
  },
  components: {
    AppShell: {
      styles: (theme: MantineTheme) => ({
        root: {
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        },
        main: {
          display: "flex",
          flex: 1,
          backgroundColor: theme.colors.gray[0],
        },
      }),
    },
    Button: Button.extend({
      classNames: buttonClasses,
      defaultProps: {
        color: "planner-primary",
      },
    }),
    Card: {
      defaultProps: {
        padding: "none",
        withBorder: true,
      },
    },
    InputWrapper: {
      styles: {
        label: {
          fontWeight: 600,
          textOverflow: "ellipsis",
          overflow: "hidden",
          maxWidth: "-webkit-fill-available",
        },
      },
    },
    SegmentedControl: SegmentedControl.extend({
      classNames: segmentedControlClasses,
      defaultProps: {
        withItemsBorders: false,
      },
    }),
    Select: {
      styles: {
        label: {
          fontWeight: 600,
        },
      },
    },
    Switch: {
      styles: {
        body: {
          padding: "8px 12px",
          border: "calc(0.0625rem * var(--mantine-scale)) solid var(--mantine-color-default-border)",
          borderRadius: 4,
          backgroundColor: "white",
        },
      },
    },
    Tabs: {
      styles: (theme: MantineTheme) => ({
        tab: {
          borderRadius: 0,
        },
        tabLabel: {
          color: theme.colors[theme.primaryColor][8],
        },
      }),
    },
    TextInput: {
      styles: {
        label: {
          fontWeight: 600,
        },
      },
    },
    Modal: {
      styles: {
        body: {
          padding: 0,
          overFlow: "hidden",
        },
        inner: {
          paddingTop: 200,
        },
      },
    },
  },
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("No root element in index.html");

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </StrictMode>
  );
}
