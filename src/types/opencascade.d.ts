declare namespace oc {
  interface TopoDS_Shape {}
  interface TopoDS_Face extends TopoDS_Shape {}
  interface TopoDS_Wire extends TopoDS_Shape {}
  interface TopoDS_Solid extends TopoDS_Shape {}
  interface TopoDS_Edge extends TopoDS_Shape {}
  interface TopoDS_Vertex extends TopoDS_Shape {}
  interface TopoDS_Compound extends TopoDS_Shape {}
  interface TopoDS_Shell extends TopoDS_Shape {}
  
  interface gp_Pnt {}
  interface gp_Vec {}
  interface gp_Dir {}
  interface gp_Ax1 {}
  interface gp_Ax2 {}
  interface gp_Trsf {}
  
  interface BRepBuilderAPI_MakeWire {}
  interface BRepBuilderAPI_MakeFace {}
  interface BRepBuilderAPI_MakeEdge {}
  interface BRepBuilderAPI_MakeVertex {}
  interface BRepBuilderAPI_Transform {}
  
  interface BRepPrimAPI_MakeBox {}
  interface BRepPrimAPI_MakeSphere {}
  interface BRepPrimAPI_MakeCylinder {}
  interface BRepPrimAPI_MakeCone {}
  interface BRepPrimAPI_MakePrism {}
  interface BRepPrimAPI_MakeRevol {}
  
  interface BRepAlgoAPI_Fuse {}
  interface BRepAlgoAPI_Cut {}
  interface BRepAlgoAPI_Common {}
  
  interface BRepFilletAPI_MakeFillet {}
  interface BRepFilletAPI_MakeChamfer {}
  
  interface BRepOffsetAPI_MakeThickSolid {}
  interface BRepOffsetAPI_MakeOffsetShape {}
  interface BRepOffsetAPI_MakePipe {}
  
  interface TopExp_Explorer {}
  interface TopAbs_ShapeEnum {}
  
  interface StlAPI_Writer {}
  interface IGESControl_Writer {}
  interface STEPControl_Writer {}
  
  interface Geom_Surface {}
  interface Geom_Curve {}
  interface Geom_BSplineCurve {}
  interface Geom_BSplineSurface {}
  
  interface TColgp_Array1OfPnt {}
  interface TColStd_Array1OfReal {}
  interface TColStd_Array1OfInteger {}
  
  interface Handle_Geom_Curve {}
  interface Handle_Geom_Surface {}
  interface Handle_Geom_BSplineCurve {}
  interface Handle_Geom_BSplineSurface {}
  
  interface BRep_Tool {}
  interface ShapeAnalysis_Surface {}
  interface GeomAPI_ProjectPointOnSurf {}
  interface GeomAPI_ProjectPointOnCurve {}
  
  interface Message_ProgressIndicator {}
  interface Standard_Transient {}
  
  interface TopTools_ListOfShape {}
  interface TopTools_IndexedMapOfShape {}
  
  interface BRepMesh_IncrementalMesh {}
  interface Poly_Triangulation {}
  interface Poly_Array1OfTriangle {}
  
  interface Standard_Real {}
  interface Standard_Integer {}
  interface Standard_Boolean {}
}

export = oc
export as namespace oc
