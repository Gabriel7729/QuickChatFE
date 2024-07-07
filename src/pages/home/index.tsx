import { Card, CardSection, Grid } from "@mantine/core";
import { StatsGrid } from "./components/stats-grid/StatsGrid";
import { useDashboardBranchData } from "../../hooks/branch/branch.hooks";
import { useAuthStore } from "../../common/store/session.store";
import BarcharGrid from "./components/barchar-grid/BarcharGrid";
import LastTransactionChar from "./components/last-transactions-char/LastTransactionChar";
import TopProductChar from "./components/top-product-char/TopProductChar";
import CategoryGrid from "./components/category-grid/CategoryGrid";

export const Home = () => {
  const { claims } = useAuthStore();
  const { data, isLoading } = useDashboardBranchData(claims?.branchId!);

  return (
    <div>
      {data && <StatsGrid data={data.value} />}
      {data && (
        <Grid p={"lg"}>
          <Grid.Col span={4}>
            <LastTransactionChar data={data.value} />
          </Grid.Col>
          <Grid.Col span={8}>
            <BarcharGrid data={data.value} />
            <Grid>
              <Grid.Col span={4}>
                <TopProductChar data={data.value} />
              </Grid.Col>
              <Grid.Col span={8}>
                <CategoryGrid
                  category={data.value.categoryRevenueChart}
                  isLoading={isLoading}
                />
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      )}
    </div>
  );
};

export default Home;
