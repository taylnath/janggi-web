import tkinter as tk
import JanggiGame

g = JanggiGame.JanggiGame()

window = tk.Tk()

cols = {0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h', 8: 'i'}
rows = {0: '1', 1: '2', 2: '3', 3: '4', 4: '5', 5: '6', 6: '7', 7: '8', 8: '9', 9: '10'}
rev_cols = {val:key for key, val in cols.items()}
rev_rows = {val:key for key, val in rows.items()}

board = {col + row: tk.StringVar() for col in rev_cols for row in rev_rows}
buttons = {col + row: None for col in rev_cols for row in rev_rows}

move_from = True
from_loc = ""

turn = tk.StringVar()
state = tk.StringVar()
red_check = tk.StringVar()
blue_check = tk.StringVar()

def update_board():
    clear_colors()
    b = g.get_board()

    global turn, state, red_check, blue_check

    colors = {"R": "salmon", "B": "sky blue"}

    # update label variables
    turn.set(g.get_player())
    state.set(g.get_game_state())
    red_check.set("Red in check? " + g.get_in_check("R"))
    blue_check.set("Blue in check? " + g.get_in_check("B"))

    for name in board:
        piece = b.get_piece(name)

        if piece is None:
            board[name].set("      ")
        else:
            board[name].set("  " + piece.get_name()[1] + "  ")
            # if piece.get_name()[1] == "G":
            #     board[name].set(" " + piece.get_name() + " ")
            # else:
            #     board[name].set(piece.get_name())
            player = piece.get_player()
            color = colors[player]
            buttons[name].configure(bg=color)
            buttons[name].configure(activebackground=color)

def clear_colors():
    global buttons

    for name in buttons:
        buttons[name].configure(bg = "#F0F0F0")
        buttons[name].configure(activebackground = "#F0F0F0")

def select_move(selection):
    "Color the possible moves, and make a move, alternating."
    global move_from
    global from_loc
    if move_from:
        move_from = False
        from_loc = selection
        piece = g.get_board().get_piece(from_loc)
        if piece is not None:
            for move in piece.get_moves():
                buttons[move].configure(bg="light green")
                buttons[move].configure(activebackground="light green")
    else:
        move_from = True
        g.make_move(from_loc, selection)
        update_board()

# create the window

for col in cols:
        # column labels
        frame = tk.Frame(master = window)
        frame.grid(row=0, column=col+1)
        lbl = tk.Label(master=frame, text=" " + cols[col] + " ")
        lbl.pack()

for ro in rows:
    for col in cols:
        # row labels
        frame = tk.Frame(master = window)
        frame.grid(row=ro + 1, column=0)
        if ro < 9:
            lbl = tk.Label(master=frame, text=" " + rows[ro] + " ")
        else:
            lbl = tk.Label(master=frame, text=rows[ro])
        lbl.pack()

        # position buttons
        frame = tk.Frame(
                master = window,
                relief = tk.RAISED,
                borderwidth = 1
        )
        frame.grid(row=ro + 1, column=col + 1)
        name = cols[col] + rows[ro]
        if ro < 9:
            btn = tk.Button(master=frame, textvariable=board[name], command= lambda txt=name: select_move(txt))
        else:
            btn = tk.Button(master=frame, textvariable = board[name], command=lambda txt=name: select_move(txt))
        buttons[name] = btn
        btn.pack()

# sidebar = tk.Frame(master=window)
# sidebar.grid(row=1, column=11, columnspan=2, sticky=tk.E + tk.W)
turn_label = tk.Label(master=window, textvariable=turn, width=20)
turn_label.grid(row=1, column=11)
state_label = tk.Label(master=window, textvariable=state, width=20)
state_label.grid(row=2, column=11)
red_check_label = tk.Label(master=window, textvariable=red_check, width=20)
red_check_label.grid(row=3, column=11)
blue_check_label = tk.Label(master=window, textvariable=blue_check, width=20)
blue_check_label.grid(row=4, column=11)

if __name__ == "__main__":
    update_board()
    window.mainloop()
