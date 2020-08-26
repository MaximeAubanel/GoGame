import React from 'react'

import { Dispatch, AnyAction, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { IAppState } from "../store/reducers";

import Text from "../components/text"

import AuthComponent from "../pageComponents/auth"
import DashboardComponent from "../pageComponents/dashboard"
import AppComponent from "../pageComponents/app"

import Ws from '../websocket/ws'

const mapStateToProps = (state: IAppState): IAppState => {
    return {
        commonState: state.commonState,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => bindActionCreators(
    {
    },
    dispatch
);

type state = {
    username: string,
    password: string,
    //
};

type wsState = {
    ready: boolean,
    username: string,
    logged: boolean,
};

type IState = {
    state: state,
    wsState: wsState,

    ws: Ws
}

class Home extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            state: {
                username: "",
                password: "",
            },
            ws: new Ws(this.handlerReady),
            wsState: {
                ready: false,
                logged: false,
                username: "",
            }
        }
    }

    handlerReady = () => {
        console.log("ede")
        this.state.ws.addListener("LOGIN_RESPONSE", (data: any) => {
            console.log(data);
        })
        this.state.ws.login("player1", "player1")
        this.state.ws.addListener("ERROR", (data: any) => { console.log(data) })

        this.setState({ wsState: { ...this.state.wsState, ready: true } })
    }

    handleUsername = (event: any) => {
        this.setState({ state: { ...this.state.state, username: event.target.value } });
    }
    handlePassword = (event: any) => {
        this.setState({ state: { ...this.state.state, password: event.target.value } });
    }

    handlerSubmit = (event: any) => {
        // this.state.ws.login(this.state.state.username, this.state.state.password)
        event.preventDefault();
    }

    _handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            this.handlerSubmit(event);
        }
    }

    render() {
        return (
            <>
                {this.state.wsState.ready ?
                    <>
                        <div style={{ position: "absolute", top: "75px", left: "150px" }}>
                            <Text fontSize="5em" icon="✌️" fontFamily={"Montserrat"}>
                                Hello
                            </Text>
                        </div >
                        {this.state.wsState.logged ?
                            <div style={{ position: "absolute", top: "200px", left: "150px" }}>
                                <AppComponent ws={this.state.ws} />
                                <DashboardComponent />
                            </div >
                            :
                            <div style={{ position: "absolute", top: "200px", left: "150px" }}>
                                <AuthComponent username={this.state.state.username} password={this.state.state.password} handlerUsername={this.handleUsername} handlerPassword={this.handlePassword} handlerSubmit={this.handlerSubmit} />
                            </div >
                        }
                    </>
                    :
                    <></>
                }
            </>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Home);