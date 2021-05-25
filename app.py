from flask import Flask, session, redirect, request
# from flask_session import Session
from tempfile import mkdtemp
from JanggiGame import JanggiGame as game
import time
import sys
import os

app = Flask(__name__, static_folder="./client/build", static_url_path="/")

# # Configure session to use filesystem (instead of signed cookies)
# app.config["SESSION_FILE_DIR"] = mkdtemp()
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"
# Session(app)

def eprint(*msg):
    print(*msg, file=sys.stderr)

@app.route("/api/time")
def hello_world():
    return {'time': time.time()}

@app.route("/api/game/new")
def new_game():
    session["game"] = game()
    eprint("made new game by request")
    return {"success": True}

@app.route("/api/game/print")
def print_board():
    if "game" not in session:
        session["game"] = game()
    return str(session["game"].get_board()._board)

@app.route("/api/game/get_moves")
def get_moves():
    if "game" not in session:
        session["game"] = game()
        eprint("made new game -- not found during get_moves")
    g = session["game"]
    from_loc = request.args.get('from')
    eprint("received get move request for", from_loc)
    eprint("current player", g.get_player())
    piece = g.get_board().get_piece(from_loc)
    eprint("piece's player", piece.get_player() if piece is not None else None)
    if piece is not None and piece.get_player() == g.get_player():
        return {
            "success": True,
            "moves": piece.get_moves()
            }
    if piece is None:
        msg = "no piece here"
    elif piece.get_player() != g.get_player():
        msg = "piece player is " + piece.get_player() + " but game player is " + g.get_player()
    return {
        "success": False,
        "msg": msg
        }
    
@app.route("/api/game/make_move")
def make_move():
    if "game" not in session:
        session["game"] = game()
        eprint("made new game -- not found in make_move")
    g = session["game"]
    # eprint(g.get_board()._board)
    from_loc = request.args.get('from')
    to_loc = request.args.get('to')
    result = g.make_move(from_loc, to_loc)
    # g.get_board().print_board()
    # eprint("player: ", g.get_player())
    return {
        "success": result,
        "curr_player": g.get_player(),
        "in_check": g._in_check,
        "state": g.get_game_state()
        }

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return {"message": "whoops"}
    # return app.send_static_file('./client/build/index.html')

# if ("FLASK_ENV" not in os.environ) or os.environ["FLASK_ENV"] == "production":
#     @app.route('/')
#     def index2():
#         return app.send_static_file('./client/build/index.html')

#     # eprint("production mode")
#     @app.errorhandler(404)
#     def not_found(e):
#         return app.send_static_file('./client/build/index.html')
#     # set static folder

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
