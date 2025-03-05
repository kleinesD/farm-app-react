import React, { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { X, Skull } from "@phosphor-icons/react";
import useMultiplePPDCalls from "../../../../hooks/api/useMultiplePPDCalls";

interface Item {
  animal: string,
  dateBefore?: string,
  title: string,
  editLink?: string,
  id?: string,
  date: Date,
  type: string
}

interface HistoryItemsContainerProps {
  items: Item[],
  changeCall: () => void
}

const HistoryItemsContainer: React.FC<HistoryItemsContainerProps> = ({ items, changeCall }) => {

  const showDelete = (event: React.MouseEvent<HTMLDivElement>) => {
    const parent = event.currentTarget.parentElement?.parentElement as HTMLElement;

    if (parent) {
      parent.classList.add('history-page-item-outter-delete');
    }
  }

  const onKeep = (event: React.MouseEvent<HTMLDivElement>) => {
    const parent = event.currentTarget.parentElement?.parentElement as HTMLElement;

    if (parent) {
      parent.classList.remove('history-page-item-outter-delete');
    }
  }

  const { mutate } = useMultiplePPDCalls({ type: 'delete' });

  const onDelete = (event: React.MouseEvent<HTMLDivElement>) => {
    const url = event.currentTarget.getAttribute('data-url');

    mutate(([{ url }]), {
      onSuccess: () => {
        changeCall();

      }
    })
  }

  return (
    <div className="history-page-container">
      {items.map((item: any, index: number) => {
        const string = moment(item.date).locale('ru').format('MMMM YYYY');

        if (item.type === 'milking') return (
          <div key={`${item.animal._id}${new Date(item.date).getTime() * index}`}>

            {item.dateBefore && <div className="history-page-month">{string.charAt(0).toUpperCase() + string.slice(1)}</div>}

            <div className="history-page-item-outter">
              <div className="history-page-item">
                <Link to={`/herd/animal/card/${item.animal._id}`} className="history-page-link hpl-animal">#{item.animal.number}</Link>
                <Link to={item.editLink} className="history-page-link history-page-link-main hpl-name">{item.title}</Link>
                <div className="history-page-date">{moment(item.date).locale('ru').format('DD MMM')}</div>
                <div className="history-page-delete" onClick={showDelete}>
                  <X size={20} color="#d44d5c" weight="bold" />
                </div>
              </div>

              <div className="hp-delete-block">
                <p>Вы уверены?</p>
                <div className="hp-delete-block-btn hp-delete-block-btn-keep" data-value="keep" onClick={onKeep}>Оставить</div>
                <div className="hp-delete-block-btn hp-delete-block-btn-delete" data-value="delete" data-url={`/api/animals/milking/${item.animal._id}/${item.id}`} onClick={onDelete}>Удалить</div>
              </div>

            </div>
          </div>
        )

        if (item.type === 'weight') return (
          <div key={`${item.animal._id}${new Date(item.date).getTime() * index}`}>
            {item.dateBefore && <div className="history-page-month">{string.charAt(0).toUpperCase() + string.slice(1)}</div>}

            <div className="history-page-item-outter">
              <div className="history-page-item">
                <Link to={`/herd/animal/card/${item.animal._id}`} className="history-page-link hpl-animal">#{item.animal.number}</Link>
                <Link to={item.editLink} className="history-page-link history-page-link-main hpl-name">{item.title}</Link>
                <div className="history-page-date">{moment(item.date).locale('ru').format('DD MMM')}</div>
                <div className="history-page-delete" onClick={showDelete}>
                  <X size={20} color="#d44d5c" weight="bold" />
                </div>
              </div>

              <div className="hp-delete-block">
                <p>Вы уверены?</p>
                <div className="hp-delete-block-btn hp-delete-block-btn-keep" data-value="keep" onClick={onKeep}>Оставить</div>
                <div className="hp-delete-block-btn hp-delete-block-btn-delete" data-value="delete" data-url={`/api/animals/weight/${item.animal._id}/${item.id}`} onClick={onDelete}>Удалить</div>
              </div>

            </div>
          </div>
        )
        if (item.type === 'lactation') return (
          <div key={`${item.animal._id}${new Date(item.date).getTime() * index}`}>
            {item.dateBefore && <div className="history-page-month">{string.charAt(0).toUpperCase() + string.slice(1)}</div>}

            <div className="history-page-item-outter">
              <div className="history-page-item">
                <Link to={`/herd/animal/card/${item.animal._id}`} className="history-page-link hpl-animal">#{item.animal.number}</Link>
                <Link to={item.editLink} className="history-page-link history-page-link-main hpl-name">{item.title}</Link>
                <div className="history-page-date">{moment(item.date).locale('ru').format('DD MMM')}</div>
                <div className="history-page-delete" onClick={showDelete}>
                  <X size={20} color="#d44d5c" weight="bold" />
                </div>
              </div>

              <div className="hp-delete-block">
                <p>Вы уверены?</p>
                <div className="hp-delete-block-btn hp-delete-block-btn-keep" data-value="keep" onClick={onKeep}>Оставить</div>
                <div className="hp-delete-block-btn hp-delete-block-btn-delete" data-value="delete" data-url={`/api/animals/lactation/${item.animal._id}/${item.id}`} onClick={onDelete}>Удалить</div>
              </div>

            </div>
          </div>
        )
        if (item.type === 'addition') return (
          <div key={`${item.animal._id}${new Date(item.date).getTime() * index}`}>
            {item.dateBefore && <div className="history-page-month">{string.charAt(0).toUpperCase() + string.slice(1)}</div>}

            <div className="history-page-item-outter">
              <div className="history-page-item">
                <Link to={`/herd/animal/card/${item.animal._id}`} className="history-page-link hpl-animal">#{item.animal.number}</Link>
                <Link to={`/herd/animal/card/${item.animal._id}`} className="history-page-link history-page-link-main hpl-name">{item.title}</Link>
                <div className="history-page-date">{moment(item.date).locale('ru').format('DD MMM')}</div>
              </div>
            </div>
          </div>
        )
        if (item.type === 'addition-dead') return (
          <div key={`${item.animal._id}${new Date(item.date).getTime() * index}`}>
            {item.dateBefore && <div className="history-page-month">{string.charAt(0).toUpperCase() + string.slice(1)}</div>}

            <div className="history-page-item-outter">
              <div className="history-page-item">
                <div className="history-page-link hpl-animal">
                  <Skull size={20} color="#0a0a0a" weight="bold" />
                </div>
                <Link to={`/herd/animal/add/dead/?edit=true&id=${item.animal._id}`} className="history-page-link history-page-link-main hpl-name">{item.title}</Link>
                <div className="history-page-date">{moment(item.date).locale('ru').format('DD MMM')}</div>
              </div>
            </div>
          </div>
        )
        if (item.type === 'write-off') return (
          <div key={`${item.animal._id}${new Date(item.date).getTime() * index}`}>
            {item.dateBefore && <div className="history-page-month">{string.charAt(0).toUpperCase() + string.slice(1)}</div>}

            <div className="history-page-item-outter">
              <div className="history-page-item">
                <Link to={`/herd/animal/card/${item.animal._id}`} className="history-page-link hpl-animal">#{item.animal.number}</Link>
                <Link to={`/herd/animal/card/${item.animal._id}`} className="history-page-link history-page-link-main hpl-name">{item.title}</Link>
                <div className="history-page-date">{moment(item.date).locale('ru').format('DD MMM')}</div>
              </div>
            </div>
          </div>
        )

        return <div key={index}></div>;
      })}
    </div>
  )
}

export default HistoryItemsContainer;