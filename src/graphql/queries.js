import { gql } from '@apollo/client';

export const CHART_DATA_QUERY = gql`
  query ChartData($chartDataInput: ChartDataInput!) {
    chartData(chartDataInput: $chartDataInput) {
      close
      closeTime
      high
      low
      numberOfTrades
      open
      openTime
      quoteAssetVolume
      volume
    }
  }
`;
