import React from "react"
import { mount, shallow } from "enzyme"
import sinon from "sinon"

import GroupLabelInput from "../../web/static/js/components/group_label_input"

describe("GroupLabelInput component", () => {
  let wrapper
  let groupWithAssociatedIdeasAndVotes

  describe("when the user changes the value", () => {
    let submitGroupLabelChangesSpy

    beforeEach(() => {
      groupWithAssociatedIdeasAndVotes = {
        id: 777,
        label: "some previous label",
        ideas: [],
        votes: [],
      }

      submitGroupLabelChangesSpy = sinon.spy()
      wrapper = shallow(
        <GroupLabelInput
          groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
          actions={{ submitGroupLabelChanges: submitGroupLabelChangesSpy }}
        />
      )

      const input = wrapper.find("input")
      input.simulate("change", { target: { value: "Turtles" } })
    })

    it("invokes submitGroupLabelChanges with the group attributes", () => {
      expect(
        submitGroupLabelChangesSpy
      ).to.have.been.calledWith(groupWithAssociatedIdeasAndVotes, "Turtles")
    })
  })

  describe("when the (persisted) group label in props changes over time", () => {
    beforeEach(() => {
      groupWithAssociatedIdeasAndVotes = {
        id: 777,
        label: "some previous label",
        ideas: [],
        votes: [],
      }
      wrapper = mount(
        <GroupLabelInput
          groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
          actions={{ submitGroupLabelChanges: () => {} }}
        />
      )
      const newGroupWithAssociatedIdeasAndVotes = {
        id: 777,
        label: "a better label",
        ideas: [],
        votes: [],
      }

      wrapper.setProps({ groupWithAssociatedIdeasAndVotes: newGroupWithAssociatedIdeasAndVotes })
    })

    describe("and the text input *matches* the group label from props", () => {
      it("adds a checkmark next to the input to indicate up-to-date persistence", () => {
        const input = wrapper.find("input[type='text']")
        input.simulate("change", { target: { value: "a better label" } })

        expect(wrapper.find(".check")).to.have.lengthOf(1)
      })
    })

    describe("when the input value no longe matches the group label from props", () => {
      it("doesn't display a checkmark, as the input has dirty, unpersisted values", () => {
        const input = wrapper.find("input[type='text']")
        input.simulate("change", { target: { value: "some weird new label" } })

        expect(wrapper.find(".check")).to.have.lengthOf(0)
      })
    })
  })
})
