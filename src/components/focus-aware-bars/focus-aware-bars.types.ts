export interface IFocusAwareBarsProps {
  statusBar?: IFocusAwareStatusBarProps;
  navigationBar?: IFocusAwareNavigationBarProps;
}

export interface IFocusAwareStatusBarProps {
  style?: 'dark' | 'light';
  color?: string;
}

export interface IFocusAwareNavigationBarProps {
  style?: 'dark' | 'light';
  color?: string;
}
