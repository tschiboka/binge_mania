import React, { Component } from "react";
import { Scrollbars } from 'react-custom-scrollbars';

import "./AdminUsers.scss";



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



export default class Admin__users extends Component {
    componentDidMount() { if (!this.props.users.length) this.getUsers(); }



    getUsers() {
        const getUsersFromDb = async () => {
            try {
                const response = await fetch("/api/users");
                const text = await response.text();

                this.props.setUsers(JSON.parse(text));
            } catch (err) { console.log(err); }
        }

        getUsersFromDb();
    }



    renderUsers() {
        return (this.props.users).map((user, i) => (<tr key={"userTable" + i}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user._id}</td>
            <td>{JSON.stringify(user.isAdmin)}</td>
        </tr>));
    }



    render() {
        return (
            <div className="Admin__user">
                <CustomScrollbars autoHide autoHideTimeout={500} autoHideDuration={200}>
                    <table>
                        <tbody>
                            <tr><th>Name</th><th>Email</th><th>id</th><th>Admin</th></tr>

                            {this.renderUsers()}
                        </tbody>
                    </table>
                </CustomScrollbars>
            </div>
        );
    }
}