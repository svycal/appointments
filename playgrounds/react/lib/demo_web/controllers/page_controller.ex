defmodule DemoWeb.PageController do
  use DemoWeb, :controller

  def home(conn, _params) do
    conn
    |> assign_page_title("Home")
    |> assign_root_layout_props()
    |> render_inertia("Home")
  end
end
