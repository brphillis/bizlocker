import * as IconsIO5 from "react-icons/io5";

export const getIcons = (): string[] => {
  const io5IconNames = [];

  for (const iconName in IconsIO5) {
    if (Object.prototype.hasOwnProperty.call(IconsIO5, iconName)) {
      io5IconNames.push(iconName);
    }
  }

  return io5IconNames;
};

export const searchIcons = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
) => {
  const name =
    formData?.name || (url && url.searchParams.get("name")?.toString()) || "";

  const iconList = getIcons();

  const matchingIcons = iconList
    .filter((iconName) =>
      iconName.toLowerCase().includes((name as string).toLowerCase())
    )
    .slice(0, 10);

  return matchingIcons.map((iconName) => ({ id: iconName, name: iconName }));
};
