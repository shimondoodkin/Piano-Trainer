import KeyConverter from "../services/key_converter.js";
import MidiService from "../services/midi_service.js";
import _ from "lodash";

describe("MidiService", function () {

  const onKeyStatus = MidiService.onKeyStatus;
  const offKeyStatus = MidiService.offKeyStatus;

  it("notifies about a simple desired key state (midi implementation 1)", function () {

    const [successCounter, failedCounter] = [0, 0];
    const successCallback = () => successCounter++;
    const failureCallback = () => failedCounter++;

    const midiService = new MidiService(successCallback, failureCallback, null, null, true);
    midiService.setDesiredKeys(["a/0"]);

    // onKeyStatus is an on event
    midiService.onMidiMessage(
      {data: [onKeyStatus, 21, 1]}
    );

    // 143 is an off event
    midiService.onMidiMessage(
      {data: [offKeyStatus, 21, 1]}
    );

    expect(failedCounter).toBe(0);
    return expect(successCounter).toBe(1);
  });

  it("notifies about a simple desired key state (midi implementation 2)", function () {

    const [successCounter, failedCounter] = [0, 0];
    const successCallback = () => successCounter++;
    const failureCallback = () => failedCounter++;

    const midiService = new MidiService(successCallback, failureCallback, null, null, true);
    midiService.setDesiredKeys(["a/0"]);

    // send on event
    midiService.onMidiMessage(
      {data: [onKeyStatus, 21, 1]}
    );

    // send another on event but set velocity to 0
    midiService.onMidiMessage(
      {data: [onKeyStatus, 21, 0]}
    );

    expect(failedCounter).toBe(0);
    return expect(successCounter).toBe(1);
  });

  it("notifies about a complex desired key state", function () {

    const [successCounter, failedCounter] = [0, 0];
    const successCallback = () => successCounter++;
    const failureCallback = () => failedCounter++;

    const midiService = new MidiService(successCallback, failureCallback, null, null, true);
    midiService.setDesiredKeys(["a/0", "c/8"]);

    midiService.onMidiMessage(
      {data: [onKeyStatus, 21, 1]}
    );

    midiService.onMidiMessage(
      {data: [onKeyStatus, 108, 1]}
    );

    midiService.onMidiMessage(
      {data: [onKeyStatus, 108, 0]}
    );

    expect(successCounter).toBe(1);
    return expect(failedCounter).toBe(0);
  });

  return it("notifies once about a wrong desired key state", function () {

    const [successCounter, failedCounter] = [0, 0];
    const successCallback = () => successCounter++;
    const failureCallback = () => failedCounter++;

    const midiService = new MidiService(successCallback, failureCallback, null, null, true);
    midiService.setDesiredKeys(["a/0", "c/8"]);

    midiService.onMidiMessage({data: [onKeyStatus, 21, 1]});
    midiService.onMidiMessage({data: [onKeyStatus, 107, 1]});

    midiService.onMidiMessage({data: [onKeyStatus, 21, 0]});
    midiService.onMidiMessage({data: [onKeyStatus, 107, 0]});

    expect(failedCounter).toBe(1);
    return expect(successCounter).toBe(0);
  });
});