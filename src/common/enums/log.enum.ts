export enum ActionStatus {
  Success,
  Error,
  Warning,
  Info,
}

export const getGradientColors = (status: ActionStatus) => {
  switch (status) {
    case ActionStatus.Success:
      return { from: "green", to: "lime", deg: 90 };
    case ActionStatus.Error:
      return { from: "red", to: "orange", deg: 90 };
    case ActionStatus.Warning:
      return { from: "yellow", to: "orange", deg: 90 };
    case ActionStatus.Info:
      return { from: "blue", to: "cyan", deg: 90 };
    default:
      return { from: "gray", to: "darkgray", deg: 90 };
  }
};
