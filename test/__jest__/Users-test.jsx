/**
 * Libraries
 */
import React from "react";
import PropTypes from "prop-types";
import {mount} from "enzyme";

/**
 * Components
 */
import {Users} from "client/components/Users";

/**
 * Setup
 */
// Replace 'window.console.error' to custom function
console.error = jest.fn((warn) => {
    throw new Error(warn);
});

/**
 * Test
 */
describe("Component 'Users' in js/Users", () => {
    // Component options for testing
    const componentOptions = {
        "context": {
            // Emulate 'react-router'
            "router": {
                "history": {
                    "push": () => {},
                    "replace": () => {},
                    "createHref": () => {}
                }
            }
        },
        "childContextTypes": {
            "router": PropTypes.object.isRequired
        }
    };

    // Data
    let userInfo = {
            "id": "1",
            "name": "Leanne Graham"
        },
        comments = [
            {
                "id": "3",
                "text": "Non et atque. occaecati deserunt quas accusantium unde odit nobis qui voluptatem.",
                "commenter": {
                    "id": "1",
                    "name": "Leanne Graham"
                }
            },
            {
                "id": "4",
                "text": "Harum non quasi et ratione. tempore iure ex voluptates in ratione.",
                "commenter": {
                    "id": "1",
                    "name": "Leanne Graham"
                }
            },
            {
                "id": "5",
                "text": "Quia molestiae reprehenderit quasi aspernatur.",
                "commenter": {
                    "id": "1",
                    "name": "Leanne Graham"
                }
            }
        ];

    it("PageLoader", () => {
        // Component for testing
        const component = mount(<Users />);

        // Check exit component "PageLoader"
        expect(component.find("PageLoader")).toHaveLength(1);
    });

    it("Error404", () => {
        // Component for testing
        const component = mount(<Users />);

        // Emulate 'componentDidMount'
        component.setState({
            "isLoading": false
        });

        // Check exist component "Error404"
        expect(component.find("Error404")).toHaveLength(1);
    });

    it("DOM structure", () => {
        // Component for testing
        const component = mount(<Users />, componentOptions);

        // Emulate 'componentDidMount'
        component.setState({
            "isLoading": false,
            "userInfo": userInfo,
            "comments": comments
        });

        // Check exist component "Header"
        expect(component.find("Header")).toHaveLength(1);

        // Check exist component "Grid"
        expect(component.find("Grid")).toHaveLength(1);

        // Check exist component "GridRow"
        expect(component.find("GridRow")).toHaveLength(2);

        // Check exist component "GridColumn"
        expect(component.find("GridColumn")).toHaveLength(3);

        // Check exist component "Card"
        expect(component.find("Card")).toHaveLength(1);

        // Check exist component "Image"
        expect(component.find("Card > Image")).toHaveLength(1);

        // Check exist component "CardContent"
        expect(component.find("Card > CardContent")).toHaveLength(3);

        // Check exist component "CardHeader"
        expect(component.find("Card > CardContent > CardHeader")).toHaveLength(1);

        // Check exist component "CardMeta"
        expect(component.find("Card > CardContent > CardMeta")).toHaveLength(1);

        // Check exist component "CardDescription"
        expect(component.find("Card > CardContent > CardDescription")).toHaveLength(1);
    });

    it("showing edit form", () => {
        // Component for testing
        const component = mount(<Users />, componentOptions);

        // Emulate 'componentDidMount'
        component.setState({
            "isLoading": false,
            "userInfo": userInfo,
            "comments": comments
        });

        // Check exist component "CommentsGroup"
        expect(component.find("CommentsGroup")).toHaveLength(1);

        // Components list of "Comments"
        component.find("CommentsGroup > Comment").forEach((commentNode) => {
            // Find edit button
            let editButton = commentNode.find("CommentActions > CommentAction").findWhere((node) => {
                return node.key() === "comment__action--edit";
            });

            // Check that found
            expect(editButton).toHaveLength(1);

            // Check not rendered any forms
            expect(commentNode.find("Form")).toHaveLength(0);

            // Simulate click for showing form
            editButton.simulate("click");

            // Check rendered one form
            expect(commentNode.find("Form")).toHaveLength(1);

            // Find cancel button
            let cancelButton = commentNode.find("Form > Button").findWhere((node) => {
                return node.prop("content") === "Cancel";
            });

            // Check that found
            expect(cancelButton).toHaveLength(1);

            // Simutale click for hidden form
            cancelButton.simulate("click");

            // Check not rendered any forms
            expect(editButton.find("Form")).toHaveLength(0);
        });
    });

    it("submit edit form", () => {
        // Component for testing
        const component = mount(<Users />, componentOptions);

        // Emulate 'componentDidMount'
        component.setState({
            "isLoading": false,
            "userInfo": userInfo,
            "comments": comments
        });

        // Find edit button
        let editButton = component.find("CardContent > Button").findWhere((node) => {
            return node.prop("content") === "Edit user";
        });

        // Check that found
        expect(editButton).toHaveLength(1);

        // Check not rendered any forms
        expect(component.find("Form")).toHaveLength(0);

        // Simulate click for showing form
        editButton.simulate("click");

        // Check rendered one form
        expect(component.find("Form")).toHaveLength(1);

        // Find submit button
        let submitButton = component.find("Form > Button").findWhere((node) => {
            return node.prop("content") === "Edit";
        });

        // Check that found
        expect(submitButton).toHaveLength(1);

        // Find input
        let inputForm = component.find("FormInput").findWhere(() => {
            return true;
        }).last();

        // Check that found
        expect(inputForm).toHaveLength(1);

        let newName = "John Doe";

        // Simulate submit form
        inputForm.simulate("change", {
            "target": {
                "value": newName
            }
        });
        component.find("Form").simulate("submit");

        let successMessage = component.find("Form > Message").findWhere((node) => {
            return node.prop("success") === true;
        });

        // Check that found
        expect(successMessage).toHaveLength(1);

        // Find cancel button
        let cancelButton = component.find("Form > Button").findWhere((node) => {
            return node.prop("content") === "Cancel";
        });

        // Check that found
        expect(cancelButton).toHaveLength(1);

        // Simutale click for hidden form
        cancelButton.simulate("click");

        // Check not rendered any forms
        expect(component.find("Form")).toHaveLength(0);

        // Check new author title
        expect(component.find("Header").text()).toEqual(newName);

        // Check new user card title
        expect(component.find("CardContent > CardHeader").text()).toEqual(newName);

        // Check comments
        component.find("CommentsItem").forEach((node) => {
            // Check new author name
            expect(node.find("CommentContent > Link").text()).toEqual(newName);
        });
    });

    it("render not empty component", () => {
        // Component for testing
        const component = mount(<Users />, componentOptions);

        // Emulate 'componentDidMount'
        component.setState({
            "isLoading": false,
            "userInfo": userInfo,
            "comments": comments
        });

        // Check author title
        expect(component.find("Header").text()).toEqual(userInfo.name);

        // Check user card title
        expect(component.find("CardContent > CardHeader").text()).toEqual(userInfo.name);

        // Check comments
        component.find("CommentsItem").forEach((node, key) => {
            // Check link to user page
            expect(node.find("CommentContent > Link").prop("to")).toEqual(`/users/view/${comments[key].commenter.id}/`);

            // Check author name
            expect(node.find("CommentContent > Link").text()).toEqual(comments[key].commenter.name);

            // Check text
            expect(node.find("CommentText").text()).toEqual(comments[key].text);
        });
    });
});
