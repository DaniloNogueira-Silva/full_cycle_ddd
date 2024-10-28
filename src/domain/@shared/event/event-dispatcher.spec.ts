import { CustomerAddressChangedEvent } from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import {
  EnviaConsoleLog1Handler,
  EnviaConsoleLog2Handler,
  EnviaConsoleLogHandler,
} from "../../customer/event/handler/customer-show-log.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});

describe("Customer Domain Events Tests", () => {
  it("should register event handlers for CustomerCreatedEvent", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(2);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(handler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(handler2);
  });

  it("should notify all CustomerCreatedEvent handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLog2Handler();
    const spyHandler1 = jest.spyOn(handler1, "handle");
    const spyHandler2 = jest.spyOn(handler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "1",
      name: "John Doe",
    });
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyHandler1).toHaveBeenCalled();
    expect(spyHandler2).toHaveBeenCalled();
  });

  it("should register and notify CustomerAddressChangedEvent handler", () => {
    const eventDispatcher = new EventDispatcher();
    const handler = new EnviaConsoleLogHandler();
    const spyHandler = jest.spyOn(handler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", handler);

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: "1",
      name: "John Doe",
      address: "Street 1, 123, 12345-678 City 1",
    });
    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyHandler).toHaveBeenCalled();
  });
});
