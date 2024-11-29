import React from "react";
import Typography, {TextTypes} from "@/components/_default/Typography";
import ContentWrapper from "@/components/_layout/ContentWrapper";

type NavProps = {
  children: React.ReactNode
  classNames?: string
}

const Navigation: React.FC<NavProps> = ({children='', classNames}) => {
  return (
      <nav className={`w-full py-8 h-auto bg-white shadow-[inset_0_-4px_50px_0_rgba(0,85,112,0.13)] ${classNames}`}>
        <ContentWrapper>
          <Typography type={TextTypes.H1} classNames={'text-black'}>{children}</Typography>
        </ContentWrapper>
      </nav>
  );
}

export default Navigation;