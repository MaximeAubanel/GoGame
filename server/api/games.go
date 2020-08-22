package api

import (
	"github.com/GoGame/database"
	"github.com/GoGame/types"
	"github.com/gorilla/mux"
	"net/http"
)

// @Tags Games
// @Router /api/games [get]
///
// @Produce json
// @Success 200 {object} types.ResponseGetAllGames
// @Failure 400 {object} types.ErrorResponse
func GetAllGames(w http.ResponseWriter, _ *http.Request) {
	var games map[string]*types.GameDefinition
	var err error

	if games, err = database.GetAllGames(); err != nil {
		errorAPI(w, http.StatusBadRequest, err)
		return
	}
	successAPI(w, http.StatusOK, types.ResponseGetAllGames{
		Games: games,
	})
	return
}

// @Tags Games
// @Router /api/games/{id} [get]
///
// @Param id path int true "ID"
// @Produce json
// @Success 200 {object} types.ResponseGetGameByID
// @Failure 400 {object} types.ErrorResponse
func GetGameByID(w http.ResponseWriter, r *http.Request) {
	var game *types.GameDefinition
	var err error

	ID, _ := mux.Vars(r)["id"]
	if game, err = database.GetGameByID(ID); err != nil {
		errorAPI(w, http.StatusBadRequest, err)
		return
	}
	successAPI(w, http.StatusOK, types.ResponseGetGameByID{
		Game: game,
	})
	return
}
