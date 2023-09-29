
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
export default function TemplateInputLabel({ title, id, value, handle, errors, type = "text", ...props }) {
    return (
        <div className="mt-6">
            <InputLabel htmlFor={id} value={title} />
            <TextInput
                {...props}
                id={id}
                type={type}
                name={id}
                value={value}
                className="mt-1 block w-full"
                isFocused={true}
                onChange={handle} />
            <InputError message={errors} className="mt-2" />
        </div >
    );
}
