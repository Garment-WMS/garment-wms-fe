export interface MenuProps {
    title: string;
    renderIcon: JSX.Element;
    isGroup?: boolean;
    children?: ChildrenMenuProps[];
    link?: string;
  }
  export interface ChildrenMenuProps {
    title: string;
    renderIcon: JSX.Element;
    link?: string;
  }
  export interface SideBarProps {
    menu : MenuProps[]
  }