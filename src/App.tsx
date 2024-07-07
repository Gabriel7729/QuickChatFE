import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "./App.css";
import { Center, Loader, MantineProvider } from "@mantine/core";
import { AppRouter } from "./routes/app-router";
import useHealthCheck from "./hooks/healthCheck/healthCheck.hooks";
import { Notifications } from "@mantine/notifications";
import { NotFound } from "./components/not-found/NotFound";
import { ModalsProvider } from "@mantine/modals";
import { styleDefaultMantine } from "./common/constants/styleDefaultMantine.constant";

function App() {
  const { data, isLoading } = useHealthCheck();

  let content;

  if (isLoading) {
    content = (
      <Center className="center-div">
        <Loader />
      </Center>
    );
  } else if (data) {
    content = (
      <ModalsProvider>
        <Notifications />
        <AppRouter />
      </ModalsProvider>
    );
  } else {
    content = (
      <Center className="center-div">
        <NotFound />
      </Center>
    );
  }

  return (
    <MantineProvider theme={styleDefaultMantine} defaultColorScheme="light">
      {content}
    </MantineProvider>
  );
}

export default App;
