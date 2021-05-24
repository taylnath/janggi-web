from flask import Flask, session, redirect, request
from flask_session import Session
from tempfile import mkdtemp
from JanggiGame import JanggiGame as game
import time
import sys

app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

def eprint(*msg):
    print(*msg, file=sys.stderr)

@app.route("/api/time")
def hello_world():
    return {'time': time.time()}

@app.route("/api/game/new")
def new_game():
    session["game"] = game()

@app.route("/api/game/print")
def print_board():
    if "game" not in session:
        session["game"] = game()
    return str(session["game"].get_board()._board)

@app.route("/api/game/get_moves")
def get_moves():
    if "game" not in session:
        session["game"] = game()
    g = session["game"]
    from_loc = request.args.get('from')
    piece = g.get_board().get_piece(from_loc)
    if piece is not None and piece.get_player() == g.get_player():
        return {
            "success": True,
            "moves": piece.get_moves()
            }
    return {"success": False}
    
@app.route("/api/game/make_move")
def make_move():
    if "game" not in session:
        session["game"] = game()
    g = session["game"]
    # eprint(g.get_board()._board)
    from_loc = request.args.get('from')
    to_loc = request.args.get('to')
    result = g.make_move(from_loc, to_loc)
    g.get_board().print_board()
    eprint("player: ", g.get_player())
    return {
        "success": result,
        "curr_player": g.get_player(),
        "in_check": g.get_in_check(),
        "state": g.get_game_state()
        }