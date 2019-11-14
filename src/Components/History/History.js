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

        this.state = { isLoading: false }
    }



    renderHistory() {
        this.setState({ ...this.state, isLoading: true });


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