import React, { Component } from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Scrollbars } from 'react-custom-scrollbars';
import "./History.scss";



const CustomScrollbars = props => (
    <Scrollbars
        renderThumbHorizontal={renderThumb}
        renderThumbVertical={renderThumb}
        {...props}
    />
);



const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
        borderRadius: 6,
        width: 6,
        backgroundColor: "deeppink",
        right: 3,
        zIndex: 2000
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
};



export default class History extends Component {
    constructor(props) {
        super(props);

        this.state = { isLoading: true, dots: "." }

        this.getHistory();
    }



    componentDidMount() {
        // css content animation is ignoerd in most browsers, so here is a interval solution
        let timer = 0, dots = "";
        const dotInterval = setInterval(() => {
            timer++;
            if (timer > 3) timer = 0;
            if (this.state.userHistory) clearInterval(dotInterval);
            else {
                switch (timer) {
                    case 0: { dots = " ..."; break; }
                    case 1: { dots = ". .."; break; }
                    case 2: { dots = ".. ."; break; }
                    case 3: { dots = "...."; break; }
                }
                this.setState({ ...this.state, dots: dots });
            }
        }, 333);
    }



    async getHistory() {
        const transResp = await fetch("api/transactions/" + this.props.user._id);
        const transJSON = await transResp.json();

        setTimeout(() => {
            this.setState({ ...this.state, isLoading: false, userHistory: transJSON });
        }, 20000)
    }



    renderHistory() {
        if (!this.state.userHistory || !this.state.userHistory.length) return <div className="History__fetching-content">Fetching your transactions{this.state.dots}</div>
        return this.state.userHistory.map((trns, i) => (
            <div
                key={"userTransaction" + i}
            >
                <p>{trns.date}</p>

                <p>{trns.movies.map(m => m.title).join(",")}</p>

                <p>£{trns.transTotal}</p>
            </div>
        ));
    }



    render() {
        return (
            <div
                className="History"
                onClick={e => { if (e.target.classList[0] === "History") this.props.closeHistory(false); }}>
                <div className="History__main--outer">
                    <div className="History__main--inner">
                        <div className="History__title--outer">
                            <div className="History__title--inner">
                                <div className="History__title--base">
                                    <div className="History__title">
                                        User History
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="History__btn-box--outer">
                            <div className="History__btn-box--middle">
                                <div className="History__btn-box--inner">
                                    <div className="History__btn-box__btn-base">
                                        <button onClick={() => this.props.closeHistory(false)}>&times;</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="History__content">
                            <CustomScrollbars autoHide autoHideTimeout={500} autoHideDuration={200}>
                                {this.renderHistory()}
                            </CustomScrollbars>
                        </div>

                        <LoadingSpinner isLoading={this.state.isLoading} />

                        <div className="History__frame--bottom--outer">
                            <div className="History__frame--bottom--middle"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}