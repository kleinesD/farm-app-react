import React, { useState, useEffect } from 'react';
import usePPDCall from '../../../../hooks/api/usePPDCall';
import { Note, Plus, Trash } from '@phosphor-icons/react';
import moment from 'moment';
import useMultiplePPDCalls from '../../../../hooks/api/useMultiplePPDCalls';

interface NotesProps {
  animal: any,
  refetch: any
}

const Notes: React.FC<NotesProps> = ({ animal, refetch }) => {
  const [visible, setVisivle] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const checkValid = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value?.length > 0) {
      document.querySelector('.acp-btn')?.classList.add('acp-btn-avai');
    } else {
      document.querySelector('.acp-btn')?.classList.remove('acp-btn-avai');
    }

    setInputValue(value);
  }

  const type1 = 'post';
  const url1 = `/api/animals/note/${animal?._id}`
  const { mutate: mutate1 } = usePPDCall({ url: url1, type: type1 });
  const saveNote = () => {
    mutate1({text: inputValue}, {
      onSuccess: () => {
        refetch();
      }
    })
  }

  const type2 = 'delete';
  const { mutate: mutate2 } = useMultiplePPDCalls({type: type2 });
  const deleteNote = (event: React.MouseEvent<HTMLDivElement>) => {
    const id = event.currentTarget.getAttribute('data-id');

    if(!id) return;

    const url2 = `/api/animals/note/${animal?._id}/${id}`
    
    mutate2([{url: url2}], {
      onSuccess: () => {
        refetch();
      }
    });
  }

  return (
    <div>
      <div className='acp-note-btn' onClick={() => setVisivle(!visible)}>
        <Note size={20} color="#f0f0f0" weight="bold" />
      </div>

      {visible &&
        <div className='acp-notes-block shadow'>
          <div className='acp-add-note-header'>
            <input id='note-text' type='text' onChange={checkValid} />
            <div className='acp-btn' onClick={saveNote}>
              <Plus size={20} color="#0a0a0a" weight="bold" />
            </div>
          </div>

          <div className='acp-notes-container'>
            {animal?.notes?.length === 0 && <div className='acp-notes-empty'>Заметки отсутствуют</div>
            }

            {animal?.notes.map((note: any, index: number) => (
              <div key={index} className='acp-note-item'>
                <p className='acp-note-text'>{note.text}</p>
                <p className='acp-note-date'>{moment(note.date).locale('ru').format('DD MMM YYYY')}</p>
                <div className='acp-note-delete-btn' data-id={note._id} onClick={deleteNote}>
                  <Trash size={20} color="#d44d5c" weight="bold" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }

    </div>
  );
};

export default Notes;