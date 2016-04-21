[Mesh]
  type = GeneratedMesh
  dim = 2
  nx = 50
  ny = 50
  nz = 0
  xmax = 50
  ymax = 50
  zmax = 0
  elem_type = QUAD9
[]

[Variables]
  [./n]
    order = FIRST
    family = LAGRANGE
  [../]
  [./u]
    order = FIRST
    family = LAGRANGE
  [../]
  [./v]
    order = FIRST
    family = LAGRANGE
  [../]
[]

[Functions]
  [./ic_func_n]
    type = ParsedFunction
    value = 'ubar + A*(cos(qo*y/sqrt(3))*cos(qo*x) - cos(2*qo*y/sqrt(3))/2)'
    vars = 'qo A ubar'
    vals = '0.86602540378444 0.53703 0.25495'
  [../]
  [./ic_func_u]
    type = ParsedFunction
    value = A*((2*qo^2*cos((2*3^(1/2)*qo*y)/3))/3-(qo^2*cos((3^(1/2)*qo*y)/3)*cos(qo*x))/3)-A*qo^2*cos((3^(1/2)*qo*y)/3)*cos(qo*x)
    vars = 'qo A ubar'
    vals = '0.86602540378444 0.53703 0.25495'
  [../]
  [./ic_func_v]
    type = ParsedFunction
    value = (5*A*qo^4*cos((3^(1/2)*qo*y)/3)*cos(qo*x))/3-A*((8*qo^4*cos((2*3^(1/2)*qo*y)/3))/9-(qo^4*cos((3^(1/2)*qo*y)/3)*cos(qo*x))/9)
    vars = 'qo A ubar'
    vals = '0.86602540378444 0.53703 0.25495'
  [../]
[]

[Kernels]
  [./euler]
    type = TimeDerivative
    variable = n
  [../]
  [./nbase]
    type = BasePFC
    variable = n
    r = 0.26
  [../]
  [./n_gradu]
    type = CoupledPFC
    variable = n
    beta = 2.0
    some_variable = u
  [../]
  [./n_gradv]
    type = CoupledPFC
    variable = n
    beta = 1.0
    some_variable = v
  [../]
  [./u_gradn]
    type = CoupledPFC
    variable = u
    beta = 1.0
    some_variable = n
  [../]
  [./v_gradu]
    type = CoupledPFC
    variable = v
    beta = 1.0
    some_variable = u
  [../]
  [./rctnu]
    type = Reaction
    variable = u
  [../]
  [./rctnv]
    type = Reaction
    variable = v
  [../]
[]

[ICs]
  [./foo_n]
    variable = n
    type = BoundingBoxFuncIC
    x1 = 15
    y1 = 15
    z1 = 0.0
    x2 = 35
    y2 = 35
    z2 = 0.0
    outside = 0.285
    inside = ic_func_n
  [../]
  [./foo_u]
    variable = u
    type = BoundingBoxFuncIC
    x1 = 15
    y1 = 15
    z1 = 0.0
    x2 = 35
    y2 = 35
    z2 = 0.0
    outside = 0.285
    inside = ic_func_u
  [../]
  [./foo_v]
    variable = v
    type = BoundingBoxFuncIC
    x1 = 15
    y1 = 15
    z1 = 0.0
    x2 = 35
    y2 = 35
    z2 = 0.0
    outside = 0.285
    inside = ic_func_v
  [../]
[]

[BCs]
  [./Periodic]
    [./auton]
      variable = n
      auto_direction = 'x y'
    [../]
    [./autou]
      variable = u
      auto_direction = 'x y'
    [../]
    [./autov]
      variable = v
      auto_direction = 'x y'
    [../]
  [../]
[]

[Postprocessors]
  [./dt]
    type = TimestepSize
  [../]
[]

[Executioner]
  type = Transient
  solve_type = PJFNK
  num_steps = 5000
  dt = 0.5
  [./TimeStepper]
    type = DT2
    e_tol = 0.1
    dt = 0.0001
    e_max = 0.1
  [../]
  [./TimeIntegrator]
    type = ImplicitEuler
  [../]
[]

[Outputs]
  exodus = true
  file_base = out
  csv = true
[]

