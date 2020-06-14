import React, { useEffect, useState } from 'react';
import './CommentTable.css';
import { getComments } from '../getComments';

const ascDir = 'asc';
const descDir = 'desc';

const TableHeader = ({ colName, activeCol, sortDir, handleClick }) => <th>
    <span className="table-header__title">{colName}</span>
    <button
        data-testid={`sort-${colName}`}
        className={activeCol === colName ? 'active-sort btn-sort' : 'btn-sort'}
        onClick={() => handleClick(colName)}>
        {activeCol === colName ? `Sorted ${sortDir === descDir ? '⮟' : '⮝'}` : 'Sort'}
    </button>
</th>

const containsText = (targetText, searchText) => targetText.toLowerCase().indexOf(searchText.toLowerCase()) >= 0

const CommentTable = () => {
    const [comments, setComments] = useState([]);
    const [currentSortCol, setCurrentSortCol] = useState('');
    const [currentSortDir, setCurrentSortDir] = useState(null);
    const [searchInput, setSearchInput] = useState('')
    let displayedComments;

    const order = (currentSortDir === ascDir) ? 1 : -1;
    const sortedComments = comments.sort((a, b) => {
        if (a[currentSortCol] > b[currentSortCol]) {
            return order;
        } else if (b[currentSortCol] > a[currentSortCol]) {
            return order * -1;
        } else {
            return 0;
        }
    });
    displayedComments = searchInput ? sortedComments.filter(c => containsText(c.email, searchInput) || containsText(c.body, searchInput))
        : sortedComments;

    const sortByColumn = (colName) => {
        let nextSortDir = ascDir;
        if (colName === currentSortCol) {
            nextSortDir = currentSortDir === ascDir ? descDir : ascDir;
        }
        setCurrentSortCol(colName);
        setCurrentSortDir(nextSortDir);
    }

    useEffect(() => {
        getComments().then(data => {
            setComments(Array.from(data));
        });
    }, [])

    return <div className="comments-container">
        <h1 data-testid="header-title">Table of Comments</h1>
        <input type="text" className="search-field" placeholder="Search email/body" value={searchInput} onChange={ev => setSearchInput(ev.target.value)}></input>
        <table data-testid="comment-table">
            <thead>
                <tr>
                    {['name', 'email', 'body'].map(col => <TableHeader key={col} colName={col} activeCol={currentSortCol} sortDir={currentSortDir} handleClick={sortByColumn} />)}
                </tr>
            </thead>
            <tbody>
                {
                    displayedComments.map(c =>
                        <tr key={c.postId + '-' + c.id}>
                            <td data-testid="comment-name">{c.name}</td>
                            <td data-testid="comment-email">{c.email}</td>
                            <td data-testid="comment-body">{c.body}</td>
                        </tr>)
                }
            </tbody>
        </table>
    </div >
}

export default CommentTable;