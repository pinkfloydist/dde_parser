import numpy as np
import matplotlib.pyplot as plt
from jitcdde import jitcdde, y, t
from sympy import Symbol

# Symbol declarations
{parameters block}

# Model
{model block}


# To improve the model refer the docs (https://jitcdde.readthedocs.io/)
def integrate_dde(dde_model, dt, total_time, initial_condition, delay_time, *params):
    dde_model.delays = [0, delay_time]
    dde_model.constant_past(initial_condition)
    dde_model.set_parameters(params[0], params[1], delay_time)
    times = np.arange(dde_model.t, dde_model.t+total_time, dt)
    out = [dde_model.integrate(t) for t in times]
    return out

def main():
    # Integration parameters
    dt = 0.01
    total_time = 1000
    initial_condition = [0.01, -0.01]
    transient = 0
    transient_steps = int(transient/dt)

    # Model parameters
    delay_time = 6
    #...

    # parameters could be declared first
    data = integrate_dde(DDE, dt, total_time, initial_condition, delay_time, 0.95, 0.212)

    fig, ax = plt.subplots(1,1, figsize=(16,9))
    ax.plot([xy[0] for xy in data[transient_steps:]], [xy[1] for xy in data[transient_steps:]])
    plt.show()

if __name__ == "__main__":
    main()
