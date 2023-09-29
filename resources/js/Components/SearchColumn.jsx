import DangerButton from "./DangerButton";
import TextInput from "./TextInput";

export default function SearchColumn({ filterText, onFilter, onClear, placeholderFilter }) {
    return (
        <>
            <TextInput
                id="search"
                type="text"
                placeholder={placeholderFilter}
                aria-label="Search Input"

                value={filterText}
                onChange={onFilter}
            />
            <DangerButton type="button" onClick={onClear}>
                X
            </DangerButton>
        </>
    );
}
