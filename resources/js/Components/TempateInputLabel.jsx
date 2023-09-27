
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
export default function TemplateInputLabel({ title, id, value, handle, ...props }) {
    return (
        <div className="mt-6">
            <InputLabel htmlFor={id} value={title} />
            <TextInput
                {...props}
                id={id}
                type="text"
                name={id}
                value={value}
                className="mt-1 block w-full"
                isFocused={true}
                onChange={handle} />
        </div >
    );
}
