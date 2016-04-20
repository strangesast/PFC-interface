[Mesh]
  type = GeneratedMesh
  dim = 2
  nx = 100
  ny = 100
  nz = 0
  xmax = 100
  ymax = 100
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
    x1 = 45
    y1 = 45
    z1 = 0.0
    x2 = 55
    y2 = 55
    z2 = 0.0
    outside = 0.285
    inside = ic_func_n
  [../]
  [./foo_u]
    variable = u
    type = BoundingBoxFuncIC
    x1 = 45
    y1 = 45
    z1 = 0.0
    x2 = 55
    y2 = 55
    z2 = 0.0
    outside = 0.285
    inside = ic_func_u
  [../]
  [./foo_v]
    variable = v
    type = BoundingBoxFuncIC
    x1 = 45
    y1 = 45
    z1 = 0.0
    x2 = 55
    y2 = 55
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

[Preconditioning]
  [./SMP]
    type = SMP
    full = true
    off_diag_row = 'u n n v'
    off_diag_column = 'n u v u'
  [../]
[]

[Executioner]
  type = Transient
  solve_type = NEWTON
  num_steps = 300
  dt = 0.5
  petsc_options = '-dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding -dm_moose_print_embedding'
  [./TimeStepper]
    type = SolutionTimeAdaptiveDT
    dt = 0.1
    percent_change = 0.2
  [../]
  [./TimeIntegrator]
    type = CrankNicolson
  [../]
[]

[Outputs]
  exodus = true
  file_base = p01b
[]

