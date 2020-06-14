import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommentTable from './components/CommentTable';
import { getComments } from './getComments';

jest.mock('./getComments');

const mockRow1 = {
    postId: 1,
    id: 1,
    name: "a test name",
    email: "a test email",
    body: "a test"
};

const mockRow2 = {
    postId: 2,
    id: 2,
    name: "b test name",
    email: "b test email",
    body: "b test"
}

test('displays header title', async () => {
    getComments.mockResolvedValue([mockRow1]);
    render(<CommentTable />);
    await screen.findAllByText(mockRow1.name);
    expect(screen.getByTestId('header-title')).toHaveTextContent('Table of Comments')
});

test('displays comment table', async () => {
    getComments.mockResolvedValue([mockRow1]);
    render(<CommentTable />);
    await screen.findAllByText(mockRow1.name);
    expect(screen.getByTestId('comment-table')).toBeInTheDocument();
    expect(screen.getByText(mockRow1.name)).toBeVisible();
    expect(screen.getByText(mockRow1.email)).toBeVisible();
    expect(screen.getByText(mockRow1.body)).toBeVisible();
    expect(screen.getByTestId('sort-name')).toBeVisible();
    expect(screen.getByTestId('sort-email')).toBeVisible();
    expect(screen.getByTestId('sort-body')).toBeVisible();
});


test('sorting on name', async () => {
    getComments.mockResolvedValue([
        mockRow1, mockRow2
    ]);
    render(<CommentTable />);
    await screen.findAllByText(mockRow1.name);
    let [firstRowName, secondRowName] = screen.getAllByTestId('comment-name').map(x => x.textContent);
    expect(firstRowName).toBe(mockRow1.name);
    expect(secondRowName).toBe(mockRow2.name);

    fireEvent.click(screen.getByTestId('sort-name')); // asc
    fireEvent.click(screen.getByTestId('sort-name')); // desc

    [firstRowName, secondRowName] = screen.getAllByTestId('comment-name').map(x => x.textContent);
    expect(firstRowName).toBe(mockRow2.name);
    expect(secondRowName).toBe(mockRow1.name);

    fireEvent.click(screen.getByTestId('sort-name')); // asc
    [firstRowName, secondRowName] = screen.getAllByTestId('comment-name').map(x => x.textContent);
    expect(firstRowName).toBe(mockRow1.name);
    expect(secondRowName).toBe(mockRow2.name);
});

test('search email', async () => {
    getComments.mockResolvedValue([mockRow1, mockRow2]);
    render(<CommentTable />);
    await screen.findAllByText(mockRow1.name);
    fireEvent.change(screen.getByPlaceholderText('Search email/body'), { target: { value: mockRow1.email } });
    expect(screen.getByText(mockRow1.name)).toBeVisible();
    expect(screen.queryByText(mockRow2.name)).toBeNull();
});
