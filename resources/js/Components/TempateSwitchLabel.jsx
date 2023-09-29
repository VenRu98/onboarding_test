
import InputLabel from '@/Components/InputLabel';
import Switch from "react-switch";
export default function TemplateSwitchLabel({ title, id, handle, value, ...props }) {
    console.log(value);
    return (
        <div className="mt-6">
            <InputLabel htmlFor={id} value={title} />
            <Switch onChange={handle} checked={value} />
        </div >
    );
}
