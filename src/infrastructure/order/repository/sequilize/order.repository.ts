import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";

import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );

    // Atualiza os itens do pedido
    await OrderItemModel.destroy({ where: { order_id: entity.id } });
    for (const item of entity.items) {
      await OrderItemModel.create({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      });
    }
  }

  async find(id: string): Promise<Order> {
    try {
      const orderModel = await OrderModel.findOne({
        where: { id },
        include: [{ model: OrderItemModel }],
        rejectOnEmpty: true,
      });

      const items = orderModel.items.map((item) => 
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
      );

      return new Order(orderModel.id, orderModel.customer_id, items);
    } catch (error) {
      throw new Error("Order not found");
    }
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    return orderModels.map((orderModel) => {
      const items = orderModel.items.map((item) => 
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
      );
      return new Order(orderModel.id, orderModel.customer_id, items);
    });
  }
}
