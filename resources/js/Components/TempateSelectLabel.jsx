
import InputLabel from '@/Components/InputLabel';
export default function TemplateSelectLabel({ title, id, selected, handle, self, list }) {
    return (
        <div className="mt-6">
            <InputLabel htmlFor={id} value={title} />
            <select disabled={disabled} name={id} id={id} className="select select-bordered w-full max-w-xs" onChange={handle}>
                <option key={0} value={""}></option>
                {
                    list
                        .filter((element) => {
                            return element != self;
                        })
                        .map((element, index) => {
                            return (
                                element == selected
                                    ? <option key={index + 1} selected value={element}>{element}</option>
                                    : <option key={index + 1} value={element}>{element}</option>
                            )
                        })
                }
            </select>
        </div >
    );
}
