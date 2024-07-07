import { Box, Center, Grid, Image, Text } from "@mantine/core";
import mySVG from "../../assets/logos/web-shooping.svg";
import LoginForm from "./LoginForm";

export const Unauthorized = () => {
  return (
    <Grid style={{ height: "100vh", overflow: "hidden" }}>
      <Grid.Col
        span={5}
        style={{
          backgroundColor: "#102234",
          overflowY: "auto",
          minHeight: "104vh",
        }}
      >
        <Center h={600}>
          <Image w={420} h={290} src={mySVG} alt="Web Shopping" />
        </Center>
        <Box style={{ padding: "45px", marginTop: "-3rem" }}>
          <Text fz={70} fw={500} component="span" c="#334557">
            Paca
          </Text>
          <Text fz={70} fw={600} component="span" c="#CF8146">
            Stock
          </Text>
          <Text c="#334557" fz="14px">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam quam,
            harum molestias magnam dolor vel eaque porro odio modi soluta.
            Dolores consequatur distinctio rem modi a ullam animi illo sed.
          </Text>
        </Box>
      </Grid.Col>
      <Grid.Col
        span="auto"
        style={{
          backgroundColor: "white",
          overflowY: "auto",
          minHeight: "104vh",
        }}
      >
        <LoginForm/>
      </Grid.Col>
    </Grid>
  );
};

export default Unauthorized;
