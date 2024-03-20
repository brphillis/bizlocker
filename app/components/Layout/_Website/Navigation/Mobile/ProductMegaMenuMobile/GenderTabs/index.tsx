import Tab from "./Tab";

type Props = {
  setSelectedGender: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedGender?: string;
};

const GenderTabs = ({ setSelectedGender, selectedGender }: Props) => {
  return (
    <div className="relative flex items-center gap-1 py-1 w-full justify-center">
      <Tab
        gender="MENS"
        setSelectedGender={setSelectedGender}
        selectedGender={selectedGender}
      />
      <Tab
        gender="WOMANS"
        setSelectedGender={setSelectedGender}
        selectedGender={selectedGender}
      />
      <Tab
        gender="KIDS"
        setSelectedGender={setSelectedGender}
        selectedGender={selectedGender}
      />
      <Tab
        gender="SALE"
        setSelectedGender={setSelectedGender}
        selectedGender={selectedGender}
      />
    </div>
  );
};

export default GenderTabs;
