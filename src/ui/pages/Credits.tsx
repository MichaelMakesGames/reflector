import React from "react";
import Menu from "../Menu";
import MenuSectionHeader from "../MenuSectionHeader";
import MenuTitle from "../MenuTitle";
import { RouterPageProps } from "../Router";

export default function Credits({ goBack }: RouterPageProps) {
  return (
    <Menu wide>
      <MenuTitle goBack={goBack}>Credits</MenuTitle>
      <MenuSectionHeader>Design, Programming, and Art</MenuSectionHeader>
      <div>
        Michael Moore{" | "}
        <Link href="https://MichaelMakes.Games">blog</Link>
        {" | "}
        <Link href="https://twitter.com/mmakesgames">@mmakesgames</Link>
      </div>
      <div className="text-sm text-lightGray mt-2">
        Some sprites adapted from{" "}
        <Link href="https://kenney.nl/assets/bit-pack">Kenney 1-Bit Pack</Link>
      </div>
      <MenuSectionHeader>Music and Sound Design</MenuSectionHeader>
      <div>
        Leonardo Madau{" | "}
        <Link href="https://leonardomadau.wixsite.com/lmcomposer">website</Link>
      </div>
      <MenuSectionHeader>Playtesters</MenuSectionHeader>
      <ul>
        <li>aonemannnARMY</li>
        <li>Bbwunder</li>
        <li>EmperorCU</li>
        <li>
          Gornova | <Link href="https://randomtower.blogspot.com">blog</Link>
        </li>
        <li>Kyzrati</li>
        <li>ozymoondias (Jonathon Moore)</li>
        <li>Quantumtroll</li>
        <li>Salmon</li>
      </ul>
    </Menu>
  );
}

function Link({
  children,
  href,
}: {
  children?: React.ReactNode;
  href: string;
}) {
  return (
    <a
      className="text-lighterBlue underline"
      target="_blank"
      rel="noreferrer"
      href={href}
    >
      {children ?? href}
    </a>
  );
}
