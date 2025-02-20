import React, { useState } from 'react';
import { Modal, Button, Select } from '@ohif/ui';

const LesionPromptModal = ({ title, onConfirm, onCancel }) => {
    const [lesionType, setLesionType] = useState('target');
    const [organ, setOrgan] = useState('');

    return (

        <div className="p-4 space-y-4">
            <Select
                label="Lesion Type"
                value={lesionType}
                options={[
                    { value: 'target', label: 'Target Lesion' },
                    { value: 'non-target', label: 'Non-Target Lesion' },
                    { value: 'new-lesion', label: 'New Lesion' },
                ]}
                onChange={setLesionType}
            />

            <div className="flex flex-col">
                <Select
                    label="Organ"
                    value={organ}
                    options={[
                        { value: 'Lung', label: 'Lung' },
                        { value: 'Abdomen', label: 'Abdomen' },
                    ]}
                    onChange={setOrgan}
                />

            </div>
            <div className="flex justify-end space-x-2">
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={() => onConfirm({ lesionType, organ })}>
                    Confirm
                </Button>
            </div>
        </div>

    );
};
export default LesionPromptModal;